package s373329.weblab3_demo.service;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.servlet.ServletContext;
import s373329.weblab3_demo.model.ResultRecord;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class DatabaseService {

    @Inject
    private ServletContext servletContext;

    private String url, user, password;

    @PostConstruct
    public void init() {
        try {Class.forName("org.postgresql.Driver"); }
        catch (ClassNotFoundException e) { throw new RuntimeException("PostgreSQL driver not found", e); }

        url      = servletContext.getInitParameter("jdbc.url");
        user     = servletContext.getInitParameter("jdbc.user");
        password = servletContext.getInitParameter("jdbc.password");

        if (url == null || user == null || password == null)
            throw new IllegalStateException("jdbc.url/user/password не заданы в web.xml");
    }

    private Connection open() throws SQLException { return DriverManager.getConnection(url, user, password); }

    public void save(ResultRecord record) {
        String sql = "INSERT INTO results(x,y,r,result,dt) VALUES (?,?,?,?,?)";
        try (Connection c = open(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setDouble(1, record.getX());
            ps.setDouble(2, record.getY());
            ps.setDouble(3, record.getR());
            ps.setBoolean(4, record.isResult());
            ps.setTimestamp(5, Timestamp.valueOf(record.getDt()));
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Не удалось сохранить результат", e);
        }
    }

    public List<ResultRecord> getAll() {
        String sql = "SELECT x,y,r,result,dt FROM results ORDER BY dt DESC";
        List<ResultRecord> list = new ArrayList<>();
        try (Connection c = open();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new ResultRecord(
                        rs.getDouble("x"),
                        rs.getDouble("y"),
                        rs.getDouble("r"),
                        rs.getBoolean("result"),
                        rs.getTimestamp("dt").toLocalDateTime()
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Не удалось загрузить результаты", e);
        }
        return list;
    }

    public void clearAll() {
        try (Connection c = open(); Statement st = c.createStatement()) {
            st.executeUpdate("DELETE FROM results");
        } catch (SQLException e) {
            throw new RuntimeException("Не удалось очистить результаты", e);
        }
    }
}
