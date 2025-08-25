const dummyBlogs = [
  {
    title: 'Getting Started with React Hooks',
    content: `<p>React Hooks are a powerful feature introduced in React 16.8 that allow you to use state and other React features without writing a class. In this blog post, we'll explore the basics of React Hooks and how they can simplify your code.</p>

<h2>What are React Hooks?</h2>
<p>Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes — they let you use React without classes.</p>

<h2>The useState Hook</h2>
<p>The useState hook is the most basic hook in React. It allows you to add state to functional components.</p>

<pre><code>import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2>The useEffect Hook</h2>
<p>The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.</p>`,
    excerpt: "Learn how to use React Hooks to simplify your React components and manage state more effectively.",
    author: '65f5c3c7c52f9b8d1e8e4567',
    category: 'React',
    tags: [],
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    title: 'Understanding JavaScript Promises',
    content: `<p>JavaScript Promises are a powerful way to handle asynchronous operations. In this blog post, we'll dive deep into how Promises work and how you can use them effectively in your code.</p>

<h2>What is a Promise?</h2>
<p>A Promise is an object representing the eventual completion or failure of an asynchronous operation. Essentially, it's a returned object to which you attach callbacks, instead of passing callbacks into a function.</p>

<h2>Creating a Promise</h2>
<p>Here's how you create a simple Promise:</p>

<pre><code>const myPromise = new Promise((resolve, reject) => {
  // Asynchronous operation
  const success = true;
  
  if (success) {
    resolve('Operation completed successfully!');
  } else {
    reject('Operation failed!');
  }
});</code></pre>

<h2>Using Promises</h2>
<p>You can use the then() and catch() methods to handle the resolved value or rejection reason:</p>

<pre><code>myPromise
  .then(result => {
    console.log(result); // 'Operation completed successfully!'
  })
  .catch(error => {
    console.error(error); // 'Operation failed!'
  });</code></pre>`,
    excerpt: "Learn how JavaScript Promises work and how to use them effectively for handling asynchronous operations in your code.",
    author: '65f5c3c7c52f9b8d1e8e4568',
    category: 'JavaScript',
    tags: [],
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80'
  },
  {
    title: 'CSS Grid Layout: A Complete Guide',
    content: `<p>CSS Grid Layout is a powerful tool that allows for two-dimensional layouts to be created on the web. This guide will help you understand and implement CSS Grid in your projects.</p>

<h2>What is CSS Grid?</h2>
<p>CSS Grid Layout is a two-dimensional layout system designed specifically for the web. It allows you to lay out items in rows and columns, and has many features that make building complex layouts straightforward.</p>

<h2>Basic Grid Layout</h2>
<p>Here's a simple example of a grid layout:</p>

<pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.item {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
}</code></pre>

<h2>Grid Areas</h2>
<p>You can name grid areas and place items in them:</p>

<pre><code>.container {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 1fr;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }</code></pre>`,
    excerpt: "Master CSS Grid Layout with this comprehensive guide covering everything from basic concepts to advanced techniques.",
    author: '65f5c3c7c52f9b8d1e8e4569',
    category: 'CSS',
    tags: [],
    imageUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  }
];

module.exports = dummyBlogs;