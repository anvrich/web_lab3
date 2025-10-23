CREATE TABLE IF NOT EXISTS results (
     id      SERIAL PRIMARY KEY,
     x       DOUBLE PRECISION NOT NULL,
     y       DOUBLE PRECISION NOT NULL,
     r       DOUBLE PRECISION NOT NULL,
    result  BOOLEAN NOT NULL,
    dt      TIMESTAMP NOT NULL
);

-- Индекс по времени — чтобы быстрый ORDER BY dt DESC
CREATE INDEX IF NOT EXISTS results_dt_idx ON results (dt DESC);
