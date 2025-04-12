import apiService from "../api/api";

const Test = () => {
  return (
    <div>
      <h1>Test</h1>
      <p>This is a test page.</p>
      <button
        onClick={() => {
          apiService.getTemperatureStream().then((response) => {
            console.log(response);
          });
        }}
      >
        Click Me{" "}
      </button>
    </div>
  );
};
export default Test;
