package org.example.yallatn.service;

import org.example.yallatn.model.Application;
import org.example.yallatn.model.Job;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Calcule un score de correspondance (0-100) entre une candidature et l'offre,
 * à partir des mots-clés de l'offre présents dans la motivation et le CV.
 * Version améliorée : pondération (titre > exigences > description), stop words, mots plus longs.
 */
@Service
public class ApplicationMatchScoreService {

    private static final int MIN_WORD_LENGTH = 3;
    private static final int MAX_KEYWORDS_PER_SECTION = 80;

    /** Mots courants à ignorer (FR + EN) pour ne pas fausser le score. */
    private static final Set<String> STOP_WORDS = Set.of(
        "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "have", "has",
        "le", "la", "les", "des", "une", "qui", "que", "est", "son", "ses", "dans", "sur", "avec", "pas", "pour", "par",
        "aux", "du", "ce", "cet", "cette", "ces", "mon", "ma", "mes", "ton", "ta", "tes", "notre", "votre", "leur", "leurs",
        "être", "avoir", "fait", "faire", "plus", "tout", "tous", "toute", "toutes", "autre", "autres", "comme", "sans", "donc", "ainsi",
        "this", "that", "with", "from", "they", "their", "will", "would", "could", "should", "about", "into", "through", "during",
        "niveau", "niveaux", "années", "ans", "année", "poste", "profil", "candidat", "candidate", "offre", "mission", "missions"
    );

    /**
     * Score 0-100 : pourcentage pondéré de mots-clés de l'offre trouvés dans motivation + CV.
     */
    public int computeMatchScore(Application application) {
        Job job = application.getJob();
        String motivation = nullToEmpty(application.getMotivation());
        String cvText = nullToEmpty(application.getCvExtractedText());
        String combinedCandidate = normalizeForMatch(motivation + " " + cvText);
        Map<String, Integer> weightedKeywords = extractWeightedKeywords(job);
        if (weightedKeywords.isEmpty()) return 50;
        return computeWeightedScore(combinedCandidate, weightedKeywords);
    }

    /**
     * Score 0-100 : pourcentage pondéré de mots-clés de l'offre trouvés dans le texte CV (CV profil enseignant).
     */
    public int computeJobMatchScoreForCvText(String cvText, Job job) {
        String combinedCandidate = normalizeForMatch(nullToEmpty(cvText));
        Map<String, Integer> weightedKeywords = extractWeightedKeywords(job);
        if (weightedKeywords.isEmpty()) return 50;
        return computeWeightedScore(combinedCandidate, weightedKeywords);
    }

    /**
     * Mots-clés pondérés : titre (poids 3), exigences (2), description (1).
     * Stop words exclus, longueur min 3, dédupliqués (poids max conservé).
     */
    private Map<String, Integer> extractWeightedKeywords(Job job) {
        Map<String, Integer> map = new LinkedHashMap<>();
        putKeywordsWithWeight(map, nullToEmpty(job.getTitre()), 3);
        putKeywordsWithWeight(map, nullToEmpty(job.getRequirements()), 2);
        putKeywordsWithWeight(map, nullToEmpty(job.getDescription()), 1);
        return map;
    }

    private void putKeywordsWithWeight(Map<String, Integer> map, String text, int weight) {
        if (text == null || text.isBlank()) return;
        int count = 0;
        for (String word : tokenize(text)) {
            if (count >= MAX_KEYWORDS_PER_SECTION) break;
            if (word.length() < MIN_WORD_LENGTH) continue;
            if (STOP_WORDS.contains(word)) continue;
            map.merge(word, weight, Math::max);
            count++;
        }
    }

    private int computeWeightedScore(String candidateText, Map<String, Integer> weightedKeywords) {
        int totalWeight = weightedKeywords.values().stream().mapToInt(Integer::intValue).sum();
        if (totalWeight == 0) return 50;
        int matchedWeight = 0;
        for (Map.Entry<String, Integer> e : weightedKeywords.entrySet()) {
            if (containsWord(candidateText, e.getKey())) matchedWeight += e.getValue();
        }
        return (int) Math.round(100.0 * matchedWeight / totalWeight);
    }

    /** Vérifie que le mot apparaît dans le texte (mot entier ou préfixe d'un mot). */
    private boolean containsWord(String text, String word) {
        if (text == null || word == null || word.isEmpty()) return false;
        if (text.contains(word)) return true;
        return Pattern.compile("\\b" + Pattern.quote(word) + "\\w*", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE).matcher(text).find();
    }

    private static String normalizeForMatch(String s) {
        if (s == null) return "";
        return s.toLowerCase(Locale.FRENCH).replaceAll("\\s+", " ").trim();
    }

    private static List<String> tokenize(String text) {
        if (text == null || text.isBlank()) return Collections.emptyList();
        return Arrays.stream(normalizeForMatch(text).split("[\\s\\p{Punct}]+"))
                .map(w -> w.replaceAll("[^a-z0-9àâäéèêëïîôùûüç]", ""))
                .filter(w -> !w.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * Filtre les candidatures dont le texte (motivation + CV) contient le mot-clé.
     */
    public boolean containsKeyword(Application application, String keyword) {
        if (keyword == null || keyword.isBlank()) return true;
        String k = keyword.trim().toLowerCase(Locale.ROOT);
        String motivation = nullToEmpty(application.getMotivation());
        String cvText = nullToEmpty(application.getCvExtractedText());
        String combined = normalizeForMatch(motivation + " " + cvText);
        return combined.contains(k);
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    /** Pour compatibilité avec l'ATS backoffice (extraction simple sans pondération). */
    public static Set<String> extractKeywords(String text) {
        if (text == null || text.isBlank()) return Set.of();
        return tokenize(text).stream()
                .filter(w -> !STOP_WORDS.contains(w))
                .limit(200)
                .collect(Collectors.toSet());
    }
}
