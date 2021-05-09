const add_user_model = {
    title: "Add User",
    action: "/admin/add-user",
    inputs: [{
        title: "Name",
        name: "name",
        type: "text"
    },{
        title: "Surname",
        name: "surname",
        type: "text"
    },{
        title: "E-Mail",
        name: "email",
        type: "email"
    },{
        title: "Username",
        name: "username",
        type: "text"
    },
    {
        title: "Password",
        name: "password",
        type: "password"
    },
    ]
}


const add_video_model = {
    title: "Add Video",
    action: "/admin/add-video",
    inputs: [{
        title: "URL",
        name: "url",
        type: "text"
    },{
        title: "Name",
        name: "name",
        type: "text"
    },{
        title: "Source",
        name: "source",
        type: "text"
    },{
        title: "Duration",
        name: "duration",
        type: "text"
    },
    ]
}


module.exports = {add_video_model,add_user_model}