# Redshift and Snowflake

This section covers Amazon Redshift and Snowflake data warehouses.

## Redshift

### Features
- Columnar storage
- MPP (Massively Parallel Processing)
- Highly scalable
- SQL queries

### Distribution Styles
1. **Key distribution**: By column
2. **Even distribution**: Evenly across nodes
3. **All distribution**: Copy entire table to each node

### Sort Keys
- **Compound sort key**: Ordered columns
- **Interleaved sort key**: Balanced order

## Snowflake

### Architecture
- **Storage layer**: Cloud object storage
- **Compute layer**: Virtual warehouses
- **Cloud services**: Authentication, metadata

### Features
- Separate storage/compute
- Multi-cluster
- Zero infrastructure management
- Automatic optimization
- Supports JSON, Avro, Parquet

---

## Cheat Sheet

### Redshift
| Command | Description |
|---------|-------------|
| Columnar storage | Compression |
| MPP | Parallel processing |
| DISTKEY | Distribution key |
| SORTKEY | Sort key |
| WLM | Workload management |

### Redshift Distribution
| Style | Use Case |
|-------|----------|
| KEY | Filtered join columns |
| EVEN | None selected |
| ALL | Small dimension tables |

### Snowflake
| Feature | Description |
|---------|-------------|
| Virtual Warehouse | Compute cluster |
| Separate storage/compute | Cost optimization |
| Time Travel | Query historical |
| Zero Copy Cloning | Easy cloning |
| Data Sharing | Cross-account |