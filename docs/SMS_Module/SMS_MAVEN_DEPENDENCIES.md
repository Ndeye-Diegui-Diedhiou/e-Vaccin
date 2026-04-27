# Maven Dependencies for SMS Integration

Add these dependencies to your `pom.xml` file under `<dependencies>` section:

## 1. Async Processing (Already included in spring-boot-starter-web)
```xml
<!-- Spring Framework Async Support -->
<!-- Already included in spring-boot-starter-web and spring-boot-starter -->
```

## 2. SMS Provider: Twilio (Optional but Recommended)
```xml
<!-- Twilio SMS API -->
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>8.10.0</version>
</dependency>
```

## 3. HTTP Client (For REST API calls to SMS providers)
```xml
<!-- Apache HttpClient for REST calls -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.14</version>
</dependency>
```

## 4. JSON Processing (For Twilio responses)
```xml
<!-- Jackson JSON processing -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
</dependency>
```

## Complete Dependencies Section to Add:

```xml
<!-- ======================= -->
<!-- SMS Integration Dependencies -->
<!-- ======================= -->

<!-- Twilio SDK for SMS -->
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>8.10.0</version>
</dependency>

<!-- Apache HttpClient for HTTP requests -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.14</version>
</dependency>

<!-- Jackson for JSON -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
</dependency>

<!-- SLF4J for logging SMS events -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.7</version>
</dependency>
```

## Notes

1. **Twilio Dependency**: Only required if you use TwilioSmsProvider
   - Can be excluded for development (using MockSmsProvider)
   - Version 8.10.0 is latest stable (as of April 2026)

2. **HttpClient**: Required for making REST calls to SMS APIs
   - Already included indirectly via Spring

3. **Jackson**: Already included in spring-boot-starter-web
   - Explicitly added for clarity

4. **SLF4J**: Already included in spring-boot-starter
   - Listed for documentation purposes

## Testing Dependencies (Add to test scope)

```xml
<!-- JUnit for testing -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-api</artifactId>
    <version>5.9.2</version>
    <scope>test</scope>
</dependency>

<!-- Mockito for mocking -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.2.0</version>
    <scope>test</scope>
</dependency>

<!-- Spring Test -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

## How to Add Dependencies

1. Open your `pom.xml` file
2. Find the `<dependencies>` section
3. Add the above dependencies
4. Save the file
5. Maven will automatically download them

Or run from terminal:
```bash
mvn clean install
```

## Version Compatibility

- Java: 11+
- Spring Boot: 3.0+
- MySQL: 5.7+

## Optional: Build Plugins

For better SMS module isolation, consider adding a maven shade plugin:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <version>3.5.0</version>
        </plugin>
    </plugins>
</build>
```
