export const todoService = {
    fetchTodos,
    createTodo,
    markTodoAsCompleted,
    changeTodosOrder,
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
        // Get the token
        let token = localStorage.getItem("token");

        if (!token || token.length === 0) {
            return null;
        }

        let response = await fetch(
            `https://factory-digital-test.herokuapp.com/api/v1/todos/create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description: description.length > 0 ? description : null,
                    dueBy,
                }),
            });
        const data = await response.json();

        // Check if the result is good
        return !!data.status;
    } catch (exception) {
        console.log("Exception adding a new todo")
        return false;
    }
}

async function markTodoAsCompleted(todoId) {
    try {
        // Get the token
        let token = localStorage.getItem("token");

        if (!token || token.length === 0) {
            return false;
        }

        let response = await fetch(
            `https://factory-digital-test.herokuapp.com/api/v1/todos/setCompleted/${todoId}`,
            {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
        const data = await response.json();

        // Check if the result is good
        return !!data.status;
    } catch (exception) {
        console.log("Exception marking todo as completed")
        return false;
    }
}

async function changeTodosOrder(first, second) {
    try {
        // Get the token
        let token = localStorage.getItem("token");

        if (!token || token.length === 0) {
            return false;
        }

        let response = await fetch(
            `https://factory-digital-test.herokuapp.com/api/v1/todos/updateOrder`,
            {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify([
                    first,
                    second
                ])
            });
        const data = await response.json();

        // Check if the result is good
        return !!data.status;
    } catch (exception) {
        console.log("Exception changing todo order")
        return false;
    }
}
