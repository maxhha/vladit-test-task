import { upperCaseAllKeysRecursive } from "./upperCaseAllKeysRecursive"

const NON_OBJECTS = [undefined, null, 0, "hello", []]

describe("upperCaseAllKeysRecursive", () => {
  it("should work with non objects", () => {
    NON_OBJECTS.forEach((it) => {
      expect(upperCaseAllKeysRecursive(it)).toEqual(it)
    })
  })

  it("should NOT work with original object", () => {
    const obj = {
      test: "hello",
    }
    expect(upperCaseAllKeysRecursive(obj)).toEqual({
      TEST: "hello",
    })
    expect(obj).toEqual({
      test: "hello",
    })
  })

  it("should ignore keys in upper case", () => {
    const obj = {
      test: "hello",
      UPPERCASE_TEST: "world",
    }
    expect(upperCaseAllKeysRecursive(obj)).toEqual({
      TEST: "hello",
      UPPERCASE_TEST: "world",
    })
  })

  it("should ignore keys in upper case", () => {
    const obj = {
      test: "hello",
      UPPERCASE_TEST: "world",
    }
    expect(upperCaseAllKeysRecursive(obj)).toEqual({
      TEST: "hello",
      UPPERCASE_TEST: "world",
    })
  })

  it("should throw error if upper case key already exists", () => {
    const obj = {
      test: "hello",
      TEST: "world",
    }
    expect(() => upperCaseAllKeysRecursive(obj)).toThrow(
      'Already have uppercased key "TEST"'
    )
  })

  it("should work recursive", () => {
    const obj = {
      test: "hello",
      test2: {
        SOME_VALUE: "world",
        prop: "!!!!",
        world: {
          hello: 10,
        },
      },
      test3: {
        simple: "object",
      },
    }
    expect(upperCaseAllKeysRecursive(obj)).toEqual({
      TEST: "hello",
      TEST2: {
        SOME_VALUE: "world",
        PROP: "!!!!",
        WORLD: {
          HELLO: 10,
        },
      },
      TEST3: {
        SIMPLE: "object",
      },
    })
  })
})
