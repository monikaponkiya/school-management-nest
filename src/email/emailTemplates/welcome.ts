export const welcomeTemplate = (schoolDetails, password) =>
  `
    <!DOCTYPE html>
    <html>
        <h3>Welcome ${schoolDetails.name}</h3>
        <p>Please login using this password: ${password}</p>
    </html>
    `;
