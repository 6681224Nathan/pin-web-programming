# How `.find()` Works

> **In one line:** `.find()` goes through an array one item at a time, asks *your* function "is this the one?", and gives back the **first** item where the answer is yes.

This is the line from `app.js` this note explains:

```js
var user = users.find(function(u) {
    return u.id === req.params.id;
});
```

And the data it searches (`users.json`):

```json
[
    { "username": "bob",  "password": "1111", "fullname": "Bob Cat",  "id": "0" },
    { "username": "tom",  "password": "2222", "fullname": "Tom Cat",  "id": "1" },
    { "username": "John", "password": "3333", "fullname": "John Doe", "id": "2" }
]
```

---

## 1. The long way: a plain loop

Before looking at `.find`, here is the same search written by hand. Every step is visible:

```js
var user;                                  // an empty box for the answer

for (var i = 0; i < users.length; i++) {   // go through the list: 0, 1, 2
    var u = users[i];                      // take the next user
    if (u.id === req.params.id) {          // is this the one?
        user = u;                          // yes, put them in the box
        break;                             // and stop looking
    }
}
```

1. Make an empty box called `user`.
2. Go through the users one at a time.
3. Ask: does this one's id match?
4. If yes, put them in the box and **stop**.
5. If the loop ends with no match, the box stays empty (`undefined`).

---

## 2. `.find` is that same loop, already written for you

The looping, the "take the next one", the "put it in the box" and the "stop" are all **hidden inside `.find`**. The only part you write is the question.

| Long way | With `.find` |
|---|---|
| `var user;` | handled by `.find` |
| `for (var i = 0; ...)` | handled by `.find` |
| `var u = users[i];` | handled by `.find`, which hands each item to you as `u` |
| **`if (u.id === req.params.id)`** | **`return u.id === req.params.id;`** ← the only part you write |
| `user = u; break;` | handled by `.find` |

Roughly, this is what `.find` looks like on the inside:

```js
function find(list, question) {
    for (var i = 0; i < list.length; i++) {
        if (question(list[i])) {   // ask YOUR function about this item
            return list[i];        // first yes: give that item back
        }
    }
    return undefined;              // no yes at all: give back nothing
}
```

> 💡 **Notice:** the `if` and the `return list[i]` already live inside `.find`. Your function only fills in the brackets of that `if`.

---

## 3. What is `function(u)`?

Normally, you write a function **and** you call it:

```js
function isTheOne(u) {
    return u.id === '2';
}

isTheOne(users[0]);   // you call it with bob  → false
isTheOne(users[2]);   // you call it with John → true
```

With `.find`, **you write the function, but `.find` does the calling.** It calls your function once for each item, passing that item in as `u`.

- `u` is just a name for *"whatever gets handed to me this time"*, like `a` and `b` in `function add(a, b)`.
- **You choose the name.** `function(person) { return person.id === ... }` works exactly the same.
- The function has **no name** because it's only needed once, right here. Writing it inside the brackets is the same as writing it separately and passing it in:

```js
// Separate and named...
function isTheOne(u) {
    return u.id === req.params.id;
}
var user = users.find(isTheOne);

// ...is exactly the same as written in place:
var user = users.find(function(u) {
    return u.id === req.params.id;
});
```

The separate version reads like a sentence: *"find, among the users, the one where `isTheOne` says yes."*

---

## 4. Why `return` looks like a condition (it isn't)

> ❓ *"Shouldn't `return` just return a value, not be a condition?"*

**Yes, and it does.** The trick is that **a comparison is a value**. `u.id === '2'` doesn't just *check* something. It **produces an answer**, `true` or `false`, the same way `2 + 3` produces `5`:

```js
console.log(2 + 3);       // 5
console.log(1 === 2);     // false
console.log(2 === 2);     // true

var answer = (1 === 2);   // you can even store it: answer is false
```

So this:

```js
return u.id === req.params.id;
```

means: **work out `u.id === req.params.id`, which is `true` or `false`, and give that back.** It's a normal `return`. It just returns a yes or a no.

The *deciding* doesn't happen in your function. It happens in `.find`'s own `if`, which looks at the yes/no you returned.

---

## 5. Watching it happen

Visiting `/profile/2`, with a `console.log` added inside to spy on each call:

```
.find handed me bob  -> I return false
.find handed me tom  -> I return false
.find handed me John -> I return true
.find gave back: John
```

| Turn | `u` is | `u.id === '2'` | `.find` does |
|:---:|---|:---:|---|
| 1 | bob (`id: '0'`) | `false` | keeps going |
| 2 | tom (`id: '1'`) | `false` | keeps going |
| 3 | John (`id: '2'`) | **`true`** | **stops, gives back John** |

If no user matches (say, `/profile/9`), every turn returns `false`, and `.find` gives back `undefined`. That's what the `if (!user)` check after it catches.

---

## 6. "Why not `if (...) return u;`?"

You might want to write it like this:

```js
var user = users.find(function(u) {
    if (u.id === req.params.id) return u;
});
```

**This works too.** But look what happens if you return something silly instead:

```js
var user = users.find(function(u) {
    if (u.id === req.params.id) return 'banana';
});
// user is John's object, NOT 'banana'
```

`.find` ignores **what** you return. It only checks:

> **Did you give me *something*, or *nothing*?**

| You return | `.find` treats it as |
|---|---|
| `true`, `u`, `'banana'`, any object | ✅ yes, this is the one |
| `false`, `undefined` (returning nothing) | ❌ no, keep looking |

On a yes, `.find` always hands back **the array item itself**, never your return value.

So `if (...) return u` works, but it's doing `.find`'s job *inside* `.find`: it already has its own `if (...) return item`. The original only answers the question, which is the only thing `.find` needs from you.

---

## 7. The picture to remember

```
         users array  ──►  [ bob ]  [ tom ]  [ John ]  ──►
                              │        │        │
                              ▼        ▼        ▼
   your function (inspector): false    false    TRUE  ──►  stop, hand back John
```

- `.find` is a **conveyor belt** carrying the items past, one at a time.
- Your function is the **inspector** standing next to it, answering `true` or `false`.
- The belt **stops at the first `true`** and gives you that item.

You only ever write the inspector. The belt already exists.

---

## Quick facts

- ✅ `.find` is an **array** tool. Plain text and plain objects don't have it.
- ✅ It returns **the first** match only, then stops looking.
- ✅ No match → it returns **`undefined`**. Always check for that (`if (!user)`).
- ✅ Your function should answer **yes or no**. Read only the line after `return`: that's the question.

### Related array tools that work the same way

| Tool | Your function answers... | Gives back |
|---|---|---|
| `.find(fn)` | "is this the one?" | the **first** item that says yes |
| `.filter(fn)` | "should I keep this?" | a new array of **every** item that says yes |
| `.map(fn)` | "what should this become?" | a new array of **your return values** |
| `.forEach(fn)` | nothing, just "do something with it" | nothing |

With `.map`, unlike `.find`, **what** you return *does* matter, because that's what goes into the new array.
