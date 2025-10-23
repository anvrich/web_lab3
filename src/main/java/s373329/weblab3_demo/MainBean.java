package s373329.weblab3_demo;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import lombok.Getter;
import lombok.Setter;
import s373329.weblab3_demo.beans.DataBean;
import s373329.weblab3_demo.model.ResultRecord;

import java.io.Serializable;
import java.time.LocalDateTime;

@Named("mainBean")
@SessionScoped
@Getter @Setter
public class MainBean implements Serializable {

    private double x;
    private double y;
    private double r = 2.0;

    @Inject
    private DataBean dataBean;

    public String changeR(double newR) {
        this.r = newR;
        return null;
    }

    private boolean checkHit(double x, double y, double R) {
        if (x <= 0 && y >= 0) return x >= -R && y <= R/2.0;                         // прямоугольник
        if (x >= 0 && y >= 0) return y <= (-0.5 * x + R/2.0) && x <= R && y <= R/2;  // треугольник
        if (x >= 0 && y <= 0) return (x*x + y*y) <= (R*R)/4.0;                       // четверть круга
        return false;
    }

    public String submit() {
        boolean result = checkHit(x, y, r);
        dataBean.add(new ResultRecord(x, y, r, result, LocalDateTime.now()));
        return null;
    }
}
