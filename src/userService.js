export const userService = {
    login,
    createAccount,
    isUserLoggedIn,
    logout,
};

async function login(email) {
    try {
        let response = await fetch(
            `https://factory-digital-test.herokuapp.com/api/v1/users/login`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email}),
            });
        const data = await response.json();

        // Check if the result is good
        if (data.status) {
            // save the token to local storage
            localStorage.setItem('token', data.results.token);
            return true;
        } else {
            return false;
        }
    } catch (exception) {
        console.log("Exception login user in")
        return false;
    }
}

async function createAccount(name, email) {
    try {
        let response = await fetch(
            `https://factory-digital-test.herokuapp.com/api/v1/users/create`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, email}),
            });
        const data = await response.json();

        // Check if the result is good
        return !!data.status;
    } catch (exception) {
        console.log("Exception signup user")
        return false;
    }
}

function logout() {
    // remove token from local storage
    localStorage.removeItem('token');
}
function isUserLoggedIn() {
    // fetch the user token
    let token = localStorage.getItem('token');
    return !!(token && token.length > 0);

}