package s373329.weblab3_demo.model;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

public class ResultRecordTest {

    @Test
    void testConstructorAndGetters() {
        LocalDateTime now = LocalDateTime.now();
        ResultRecord r = new ResultRecord(1.0, 2.0, 3.0, true, now);

        assertEquals(1.0, r.getX());
        assertEquals(2.0, r.getY());
        assertEquals(3.0, r.getR());
        assertTrue(r.isResult());
        assertEquals(now, r.getDt());
    }

    @Test
    void testNoArgsConstructor() {
        ResultRecord r = new ResultRecord();
        assertEquals(0.0, r.getX());
        assertEquals(0.0, r.getY());
        assertEquals(0.0, r.getR());
        assertFalse(r.isResult());
        assertNull(r.getDt());
    }
}
