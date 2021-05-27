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


const add_video_channel = {
    title: "Add Channel",
    action: "/admin/add-channel",
    inputs: [{
        title: "URL",
        name: "url",
        type: "text"
    },
    {
        title: "Name",
        name: "name",
        type: "text"
    },
    {
        title: "Img Url",
        name: "img_url",
        type: "text"
    }
    ]
}


const add_video_category = {
    title: "Add Category",
    action: "/admin/add-category",
    inputs: [{
        title: "Title",
        name: "title",
        type: "text"
    },
    {
        title: "Is Private",
        name: "is_private",
        type: "checkbox"
    },
    {
        title: "User ID",
        name: "user_id",
        type: "integer"
    }
    ]
}

const add_category_has_video = {
    title: "Add Category",
    action: "/admin/add-category-has-video",
    inputs: [{
        title: "Video Id",
        name: "video_id",
        type: "integer"
    },
    {
        title: "Category UUID",
        name: "category_uuid",
        type: "text"
    }
    ]
}

const user_video_model = {
    title: "Add User Video",
    action: "/admin/add-user-video",
    inputs: [{
        title: "User Id",
        name: "user_id",
        type: "integer"
    },
    {
        title: "Video Id",
        name: "video_id",
        type: "integer"
    },
    {
        title: "Notes",
        name: "notes",
        type: "text"
    },
    {
        title: "Rating",
        name: "rating",
        type: "integer"
    }
    ]
}

const user_follows_channel_model = {
    title: "User Follows Channel",
    action: "/admin/add-user-follows-channel",
    inputs: [{
        title: "User Id",
        name: "user_id",
        type: "integer"
    },
    {
        title: "Channel Id",
        name: "channel_id",
        type: "integer"
    },
    {
        title: "Since",
        name: "since",
        type: "date"
    },
    ]
}

const category_has_channel = {
    title: "Add Category Has Channel",
    action: "/admin/add-category-has-channel",
    inputs: [{
        title: "Channel Id",
        name: "channel_id",
        type: "integer"
    },
    {
        title: "Category UUID",
        name: "category_uuid",
        type: "text"
    }
    ]
}



module.exports = {category_has_channel,user_follows_channel_model,add_video_model,add_user_model,add_video_category,add_video_channel,user_video_model,add_category_has_video}