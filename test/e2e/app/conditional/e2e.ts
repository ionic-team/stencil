
// Setup the test harness. This will get cleaned out with every test.
let app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);
let scratch: HTMLDivElement; // This will hold the actual element under test.

beforeEach(function() {
  scratch = document.createElement("div");
  scratch.id = "scratch";
  app.appendChild(scratch);
});

afterEach(function() {
  app.innerHTML = "";
  scratch = null;
});

describe("basic support", function() {

  describe("no children", function() {
    it("can display a Custom Element with no children", function() {
      this.weight = 3;
      scratch.innerHTML = '<cmp-a></cmp-a>';
      let wc = scratch.querySelector("cmp-a");
      expect(wc.tagName).toEqual('CMP-A');
    });
  });
});
