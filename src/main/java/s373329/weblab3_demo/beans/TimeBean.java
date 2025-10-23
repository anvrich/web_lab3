package s373329.weblab3_demo.beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Named("timeBean")
@ApplicationScoped
public class TimeBean {
    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")
                    .withZone(ZoneId.systemDefault());

    public String getCurrentTime() {
        return FMT.format(Instant.now());
    }
}
