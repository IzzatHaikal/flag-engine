import { describe, expect, it } from "vitest";
import { createFlagEngine } from "..";

const engine = createFlagEngine([
  {
    key: "summer-sale",
    status: "enabled",
    strategies: [
      {
        name: "All audience",
        rules: [],
        variants: [
          {
            name: "A",
            percent: 50,
          },
          {
            name: "B",
            percent: 50,
          },
        ],
      },
    ],
  },
]);

describe("repartition", () => {
  it("should be distributive", () => {
    const COUNT = 1000_000;
    let A = 0;
    let B = 0;

    for (let i = 0; i < COUNT; i++) {
      const userCtx = engine.createUserContext({ __id: `user-${i}` });
      const variant = userCtx.evaluate("summer-sale");
      if (variant === "A") {
        A++;
      } else if (variant === "B") {
        B++;
      }
    }

    const halfCount = COUNT / 2;
    const halfCountUpper = halfCount * 1.001;
    const halfCountLower = halfCount * 0.999;

    expect(A).toBeGreaterThan(halfCountLower);
    expect(A).toBeLessThan(halfCountUpper);
    expect(B).toBeGreaterThan(halfCountLower);
    expect(B).toBeLessThan(halfCountUpper);
  });
});
