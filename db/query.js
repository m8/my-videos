const create_db = "CREATE DATABASE IF NOT EXISTS myvideos";
const use_db = "USE myvideos";
const create_user = `CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    name VARCHAR(45) NOT NULL,
    surname VARCHAR(45) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(45) UNIQUE NOT NULL,
    PRIMARY KEY (id)
    );
`;

const create_video = `CREATE TABLE IF NOT EXISTS video (
    id INT NOT NULL,
    url VARCHAR(45) UNIQUE NOT NULL,
    name VARCHAR(45) NOT NULL,
    source VARCHAR(45) NOT NULL,
    duration INT NULL,
    PRIMARY KEY (id)
    );
`;

const create_category = `CREATE TABLE IF NOT EXISTS category (
    uuid VARCHAR(50) NOT NULL,
    title VARCHAR(45) NOT NULL,
    is_private TINYINT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (uuid),
    CONSTRAINT category_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    );
`;


const create_user_has_video = `CREATE TABLE IF NOT EXISTS user_has_video (
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    notes TEXT(1000) NULL,
    rating INT NULL,
  
    PRIMARY KEY (user_id, video_id),
   
    FOREIGN KEY (user_id)
      REFERENCES user (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
  
    FOREIGN KEY (video_id)
      REFERENCES video (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );`

const create_category_has_video = `CREATE TABLE IF NOT EXISTS category_has_video (
    category_uuid VARCHAR(50) NOT NULL,
    video_id INT NOT NULL,
    PRIMARY KEY (category_uuid, video_id),
  
    FOREIGN KEY (category_uuid)
      REFERENCES category (uuid)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   
    FOREIGN KEY (video_id)
      REFERENCES video (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );`

const create_channel = `CREATE TABLE IF NOT EXISTS channel (
    id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  );`



const create_user_follows_channel = ` CREATE TABLE IF NOT EXISTS user_follows_channel (
    user_id INT NOT NULL,
    channel_id INT NOT NULL,
    since DATE NULL,
   
    PRIMARY KEY (user_id, channel_id),
  
    FOREIGN KEY (user_id)
      REFERENCES user (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   
    FOREIGN KEY (channel_id)
      REFERENCES channel (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );`


const create_category_has_channel = ` CREATE TABLE IF NOT EXISTS category_has_channel (
  category_uuid VARCHAR(50) NOT NULL,
  channel_id INT NOT NULL,
 
  PRIMARY KEY (category_uuid, channel_id),

  FOREIGN KEY (category_uuid)
    REFERENCES category (uuid)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  FOREIGN KEY (channel_id)
    REFERENCES channel (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
`



module.exports = { create_category, create_user_has_video, create_user_has_video, create_category_has_video, create_channel, create_db, use_db, create_user, create_video,create_user_has_video,create_category_has_channel,create_user_follows_channel };

