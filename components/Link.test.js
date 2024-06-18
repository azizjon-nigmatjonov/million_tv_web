test('adding floating point numbers', () => {
    const value = 0.2 + 0.2
    expect(value).toBe(0.4)
    // expect(value).toBeCloseTo(0.3) // This works.
})
