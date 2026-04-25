# AWS S3

> Simple Storage Service (S3) features, storage classes, and security in AWS.

---

## S3 Features

| Feature | Description |
|---------|-------------|
| Scalable Storage | Unlimited storage |
| Data Types | Structured, semi-structured, unstructured |
| Durability | 99.999999999% (11 nines) |
| Security | Encryption, access control |
| Lifecycle | Auto transition between storage types |
| Versioning | Keep multiple versions |
| Cross-Region Replication | Disaster recovery |

---

## Storage Classes

| Class | Use Case | Retrieval |
|-------|---------|----------|
| S3 Standard | Frequent access | Immediate |
| S3 Intelligent | Variable access | Milliseconds |
| S3 Glacier | Archives | 1-12 hours |
| S3 Glacier Deep | Long-term archive | 12 hours |
| S3 One Zone-IA | Infrequent | Milliseconds |

---

## Security

### Encryption

| Type | Description |
|------|-------------|
| SSE-S3 | Server-side, AWS managed |
| SSE-KMS | Server-side, customer keys |
| SSE-C | Client managed keys |
| Client-side | Encrypt before upload |

### Access Control

- **IAM Policies**: User/role-based
- **Bucket Policies**: JSON at bucket level
- **ACLs**: Object/bucket level

### Versioning

- Store all versions
- Delete creates delete marker
- Can restore previous versions

### MFA Delete

Additional authentication for deletion.

---

## Folder Structure

```
bucket/
  raw/
    csv/
    json/
    api/
  processed/
  archive/
```

---

## Cheat Sheet

| Feature | Command |
|---------|--------|
| Create bucket | AWS Console |
| Upload | drag-drop or CLI |
| Lifecycle | Configure in console |
| Versioning | Enable in properties |