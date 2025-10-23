package s373329.weblab3_demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultRecord {
    private double x;
    private double y;
    private double r;
    private boolean result;
    private LocalDateTime dt;
}