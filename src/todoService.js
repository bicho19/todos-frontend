export const todoService = {
    fetchTodos,
    createTodo,
};

async function fetchTodos() {
    try {
        // Get the token
        let token = localStorage.getItem("token");

        if (!token || token.length === 0) {
            return null;
        }

        // Send the fetch request
        let response = await fetch(
            'https://factory-digital-test.herokuapp.com/api/v1/todos/myTodos',
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        const data = await response.json();

        // Check if the result is good
        if (data.status) {
            return data.results;
        } else {
            return null;
        }
    } catch (exception) {
        console.log("Exception fetching todos")
        return null;
    }
}

async function createTodo(title, description, dueBy) {
    try {
        let response = await fetch(
            `https://factory-digital-test.herokuapp.com/api/v1/todos/create`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title, description, dueBy}),
            });
        const data = await response.json();

        // Check if the result is good
        return !!data.status;
    } catch (exception) {
        console.log("Exception adding a new todo")
        return false;
    }
}
