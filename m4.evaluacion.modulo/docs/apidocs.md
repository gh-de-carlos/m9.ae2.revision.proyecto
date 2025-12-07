# Todos - Docs

The todos endpoint provides a dataset of sample to-do items, including details like task descriptions, statuses, and user IDs, ideal for testing and prototyping task management and productivity applications.

## Get all todos

By default you will get 30 items, use Limit and skip to paginate through all items.

```js
fetch('https://dummyjson.com/todos')
.then(res => res.json())
.then(console.log);
```

## Get a single todo

```js
fetch('https://dummyjson.com/todos/1')
.then(res => res.json())
.then(console.log);
```

## Get a random todo

The random data will change on every call to `/random`.
You can optionally pass a length of max 10 as `/random/10`.

```js
fetch('https://dummyjson.com/todos/random')
.then(res => res.json())
.then(console.log);
```

## Limit and skip todos

You can pass limit and skip params to limit and skip the results for pagination, and use limit=0 to get all items.

```js
fetch('https://dummyjson.com/todos?limit=3&skip=10')
.then(res => res.json())
.then(console.log);
```

## Get all todos by user id

```js
/* getting todos of user with id 5 */
fetch('https://dummyjson.com/todos/user/5')
.then(res => res.json())
.then(console.log);
```

## Add a new todo

Adding a new todo will not add it into the server.
It will simulate a POST request and will return the new created todo with a new id

```js
fetch('https://dummyjson.com/todos/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    todo: 'Use DummyJSON in the project',
    completed: false,
    userId: 5,
  })
})
.then(res => res.json())
.then(console.log);
```

## Update a todo

Updating a todo will not update it into the server.
It will simulate a PUT/PATCH request and will return updated todo with modified data

```js
/* updating completed status of todo with id 1 */
fetch('https://dummyjson.com/todos/1', {
  method: 'PUT', /* or PATCH */
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    completed: false,
  })
})
.then(res => res.json())
.then(console.log);
```

## Delete a todo

Deleting a todo will not delete it into the server.
It will simulate a DELETE request and will return deleted todo with isDeleted & deletedOn keys

```js
fetch('https://dummyjson.com/todos/1', {
  method: 'DELETE',
})
.then(res => res.json())
.then(console.log);
```
