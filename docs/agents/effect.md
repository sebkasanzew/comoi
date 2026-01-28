# Effect.js patterns

Always use `Effect.gen` for readability.

## Example

```typescript
const program = Effect.gen(function* (_) {
  const service = yield* _(MyService);
  return yield* _(service.doSomething());
});
```

Type errors explicitly.

```typescript
class MyError extends Data.TaggedError("MyError")<{
  reason: "NOT_FOUND" | "INVALID";
}> {}
```

Use Layers for DI.

```typescript
const live = Effect.provide(program, MyServiceLive);
```
