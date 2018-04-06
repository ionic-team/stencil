
describe("basic support", function() {
  let app = document.createElement("div");
  document.body.appendChild(app);
  let scratch: HTMLDivElement; // This will hold the actual element under test.

  beforeEach(function() {
    scratch = document.createElement("div");
    app.appendChild(scratch);
  });

  afterEach(function() {
    app.innerHTML = "";
    scratch = null;
  });

  describe("no children", function() {
    it("can display a Custom Element with no children", function(done) {
      scratch.innerHTML = '<cmp-a></cmp-a>';
      let wc = scratch.querySelector("cmp-a");

      window.addEventListener('appload', () => {
        console.log('app load');
        let button = wc.querySelector('button');
        expect(button).toBeDefined();
        done();
      });
    });
  });
});
