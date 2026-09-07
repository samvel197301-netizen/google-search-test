const { formatResults } = require("../server");

describe("Google search results", () => {

    test("correctly formats Google organic results", () => {

        const googleResponse = {
            organic_results: [
                {
                    position: 1,
                    title: "Example website",
                    link: "https://example.com",
                    snippet: "Example description"
                }
            ]
        };

        const results = formatResults(googleResponse);

        expect(results).toEqual([
            {
                position: 1,
                title: "Example website",
                url: "https://example.com",
                description: "Example description"
            }
        ]);
    });

    test("returns empty array when there are no organic results", () => {

        const results = formatResults({
            organic_results: []
        });

        expect(results).toEqual([]);
    });

    test("result contains required fields", () => {

        const results = formatResults({
            organic_results: [
                {
                    position: 1,
                    title: "Test",
                    link: "https://example.com",
                    snippet: "Description"
                }
            ]
        });

        expect(results[0]).toHaveProperty("position");
        expect(results[0]).toHaveProperty("title");
        expect(results[0]).toHaveProperty("url");
        expect(results[0]).toHaveProperty("description");
    });

});