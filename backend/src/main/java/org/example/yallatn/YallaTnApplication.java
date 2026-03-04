package org.example.yallatn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class YallaTnApplication {

	public static void main(String[] args) {
		SpringApplication.run(YallaTnApplication.class, args);
	}

}
