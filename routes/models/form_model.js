const user_form_model = {
    title: "Filter User",
    action: "/admin/find-user",
    table_name: "user",
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
    }]
};

const find_video_model = {
    title: "Add Video",
    table_name: "video",
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



module.exports = {user_form_model, find_video_model};
