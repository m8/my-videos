# my videos

## screenshots

![welcome page](readme/2021-06-01-23-37-31.png)

Welcome Page

![](readme/2021-06-01-23-37-52.png)

Video details

![](readme/2021-06-01-23-38-48.png)

Follow channels inside myvideos


## dev
- create `default.js` under `db` folder, template should be like:

```js
module.exports = {
   
    db: {
      user: "mysql_user_name",
      password: "mysql_user_password"
    },

};
```

### running
- you can run node with nodemon. to install `npm install -g nodemon`, after just type `nodemon` to run.




## bookmarklet
- videos can be saved with bookmarklet.

```
javascript:javascript:(function(){var%20url%20=%20location.href;var%20description=document.getSelection()||'';var%20title%20=%20document.title%20||%20url;window.open('http://localhost:3000/bookmarklet/add/' + encodeURIComponent(url)+'/'+encodeURIComponent(title),'_blank','menubar=no,height=450,width=600,toolbar=no,scrollbars=yes,status=no,dialog=1');})();
```

![](readme/2021-06-01-23-39-37.png)