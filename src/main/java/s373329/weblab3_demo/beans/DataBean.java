package s373329.weblab3_demo.beans;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import lombok.Getter;
import s373329.weblab3_demo.model.ResultRecord;
import s373329.weblab3_demo.service.DatabaseService;

import java.io.Serializable;
import java.util.List;

@Named("dataBean")
@ApplicationScoped
@Getter
public class DataBean implements Serializable {

    @Inject
    private DatabaseService db;

    private List<ResultRecord> records;

    @PostConstruct
    public void init() {
        records = db.getAll();
    }

    public void add(ResultRecord record) {
        db.save(record);
        reload();
    }

    public void clear() {
        db.clearAll();
        reload();
    }

    private void reload() {
        records = db.getAll();
    }
}