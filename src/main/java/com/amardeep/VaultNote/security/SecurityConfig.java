package com.amardeep.VaultNote.security;


import com.amardeep.VaultNote.config.OAuth2LoginSuccessHandler;
import com.amardeep.VaultNote.models.AppRole;
import com.amardeep.VaultNote.models.Role;
import com.amardeep.VaultNote.models.User;
import com.amardeep.VaultNote.repositories.RoleRepository;
import com.amardeep.VaultNote.repositories.UserRepository;
import com.amardeep.VaultNote.security.jwt.AuthEntryPointJwt;
import com.amardeep.VaultNote.security.jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
//@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    @Lazy
    OAuth2LoginSuccessHandler loginSuccessHandler;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {

        //http.addFilterBefore(sameSiteCookieFilter(), UsernamePasswordAuthenticationFilter.class);

        http.cors(Customizer.withDefaults());
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        //http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()).csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
               // .ignoringRequestMatchers("/api/auth/public/**","/api/csrf-token"));
                http.csrf(csrf -> csrf.disable());
                http.authorizeHttpRequests((requests) ->
                requests.requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/csrf-token").permitAll()
                        .requestMatchers("/api/auth/public/**").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .anyRequest().authenticated())
                        .oauth2Login(oauth2 -> {
                          oauth2.successHandler(loginSuccessHandler);
                         });
        //http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));
        http.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler));
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        http.formLogin(Customizer.withDefaults());
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        // Allow specific origins
        corsConfig.setAllowedOrigins(Collections.singletonList(frontendUrl));

        // Allow specific HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow specific headers
        corsConfig.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-XSRF-TOKEN"));
        corsConfig.setExposedHeaders(List.of("X-XSRF-TOKEN"));
        // Allow credentials (cookies, authorization headers)
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);
        // Define allowed paths (for all paths use "/**")
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig); // Apply to all endpoints
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository, UserRepository userRepository) {
        return args -> {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_USER)));

            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_ADMIN)));

            if (!userRepository.existsByUserName("user1")) {
                User user1 = new User("user1", "user1@example.com", passwordEncoder().encode("password1"));
                user1.setAccountNonLocked(false);
                user1.setAccountNonExpired(true);
                user1.setCredentialsNonExpired(true);
                user1.setEnabled(true);
                user1.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
                user1.setAccountExpiryDate(LocalDate.now().plusYears(1));
                user1.setTwoFactorEnabled(false);
                user1.setSignUpMethod("email");
                user1.setRole(userRole);
                userRepository.save(user1);
            }

            if (!userRepository.existsByUserName("admin")) {
                User admin = new User("admin", "admin@example.com", passwordEncoder().encode("adminPass"));
                admin.setAccountNonLocked(true);
                admin.setAccountNonExpired(true);
                admin.setCredentialsNonExpired(true);
                admin.setEnabled(true);
                admin.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
                admin.setAccountExpiryDate(LocalDate.now().plusYears(1));
                admin.setTwoFactorEnabled(false);
                admin.setSignUpMethod("email");
                admin.setRole(adminRole);
                userRepository.save(admin);
            }
        };
    }
}
