// Declare private and public route groups
const publicRoutes = ["/", "/login", "/signup"];
const privateRoutes = ["/home", "/features", "/history"];

// Function to check for private/public routes
export default function checkPrivateRoute(link) {
  // Create regular expressions for both public and private routes
  const publicRegex = new RegExp(
    `^(${publicRoutes.map((route) => route.replace("/", "\\/")).join("|")})$`
  );
  const privateRegex = new RegExp(
    `^(${privateRoutes.map((route) => route.replace("/", "\\/")).join("|")})$`
  );

  // Return check result
  if (publicRegex.test(link)) {
    return "public";
  } else if (privateRegex.test(link)) {
    return "private";
  } else {
    return "nuh uh";
  }
}
