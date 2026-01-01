# API Changes: Entry Related Data

## Summary

API responses for Entry endpoints now include `related` data for ref-type fields in `data_json`. This provides additional information about referenced entries without requiring additional API calls.

## Affected Endpoints

- `GET /api/v1/admin/entries/{id}` - Single entry
- `GET /api/v1/admin/entries` - Entry list/collection
- `POST /api/v1/admin/entries` - Create entry (response)
- `PUT /api/v1/admin/entries/{id}` - Update entry (response)

## Response Structure

### Single Entry Response

```json
{
  "data": {
    "id": 1,
    "title": "Article",
    "data_json": {
      "author": 42,
      "relatedArticles": [43, 44]
    },
    "related": {
      "entryData": {
        "42": {
          "entryTitle": "John Doe",
          "entryPostType": "Author"
        },
        "43": {
          "entryTitle": "Related Article 1",
          "entryPostType": "Article"
        },
        "44": {
          "entryTitle": "Related Article 2",
          "entryPostType": "Article"
        }
      }
    }
  }
}
```

### Collection Response

```json
{
  "data": [
    {
      "id": 1,
      "data_json": { "author": 42 }
    },
    {
      "id": 2,
      "data_json": { "author": 42, "related": [43] }
    }
  ],
  "related": {
    "entryData": {
      "42": {
        "entryTitle": "Shared Author",
        "entryPostType": "Author"
      },
      "43": {
        "entryTitle": "Related Entry",
        "entryPostType": "Article"
      }
    }
  },
  "links": {...},
  "meta": {...}
}
```

## Field Descriptions

### `related` (object, optional)

Top-level object containing related data. Only present if there are ref-type fields in `data_json` with valid references.

### `related.entryData` (object)

Mapping of entry IDs to entry metadata:
- **Key**: Entry ID (string representation of integer)
- **Value**: Object with:
  - `entryTitle` (string|null): Title of the referenced entry
  - `entryPostType` (string|null): Post type name of the referenced entry

## Behavior

1. **Presence**: `related` field is only included if:
   - Entry has a Blueprint with ref-type fields
   - `data_json` contains ref values
   - Referenced entries exist and are not deleted

2. **Deleted Entries**: Soft-deleted entries are excluded from `related.entryData`. If all referenced entries are deleted, `related` may be empty or absent.

3. **Collection Optimization**: For collection endpoints, `related` is provided at the collection level (not per entry) to avoid duplication.

4. **Empty Values**: If `data_json` has no ref fields or all ref values are null/invalid, `related` is not included in the response.

## Examples

### Single Ref Field

**Request:**
```json
{
  "data_json": {
    "author": 42
  }
}
```

**Response:**
```json
{
  "data": {
    "data_json": { "author": 42 },
    "related": {
      "entryData": {
        "42": {
          "entryTitle": "John Doe",
          "entryPostType": "Author"
        }
      }
    }
  }
}
```

### Array Ref Field

**Request:**
```json
{
  "data_json": {
    "relatedArticles": [43, 44, 45]
  }
}
```

**Response:**
```json
{
  "data": {
    "data_json": { "relatedArticles": [43, 44, 45] },
    "related": {
      "entryData": {
        "43": { "entryTitle": "Article 1", "entryPostType": "Article" },
        "44": { "entryTitle": "Article 2", "entryPostType": "Article" },
        "45": { "entryTitle": "Article 3", "entryPostType": "Article" }
      }
    }
  }
}
```

### Nested Ref Field

**Request:**
```json
{
  "data_json": {
    "author": {
      "profile": 42
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "data_json": { "author": { "profile": 42 } },
    "related": {
      "entryData": {
        "42": {
          "entryTitle": "User Profile",
          "entryPostType": "Profile"
        }
      }
    }
  }
}
```

### Deleted Entry Reference

**Request:**
```json
{
  "data_json": {
    "author": 42
  }
}
```

**Response** (if entry 42 is deleted):
```json
{
  "data": {
    "data_json": { "author": 42 }
  }
}
```

Note: `related` is absent or `related.entryData` is empty.

## TypeScript Types

```typescript
interface EntryRelatedData {
  entryData?: Record<string, {
    entryTitle: string | null;
    entryPostType: string | null;
  }>;
}

interface EntryResponse {
  data: {
    id: number;
    title: string;
    data_json: Record<string, any>;
    related?: EntryRelatedData;
    // ... other fields
  };
}

interface EntryCollectionResponse {
  data: EntryResponse['data'][];
  related?: EntryRelatedData;
  links: PaginationLinks;
  meta: PaginationMeta;
}
```

## Migration Notes

1. **Backward Compatible**: Existing code will continue to work. `related` is optional and only added when applicable.

2. **Optional Usage**: Frontend can choose to:
   - Use `related` data for display (recommended)
   - Fall back to fetching entry details if `related` is missing
   - Ignore `related` if not needed

3. **Collection Handling**: For collections, check `related` at the collection level first, then fall back to per-entry `related` if needed.

## Future Extensibility

The `related` structure is designed to be extensible. Future versions may include:
- `related.mediaData` - Media file metadata
- `related.termData` - Taxonomy term information
- Other related data types

Always check for the presence of keys before accessing them.

