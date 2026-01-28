# Convex patterns

Queries and mutations should use Effect for business logic.

## Example

```typescript
export const myQuery = query({
  args: { id: v.id("table") },
  handler: async (ctx, args) => {
    const program = Effect.gen(function* (_) {
      // ...
    });
    return Effect.runPromise(program);
  }
});
```
