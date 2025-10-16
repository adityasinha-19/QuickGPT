import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// const response = await client.files.upload({
//   file: fs.createReadStream("path/to/file"),
//   fileName: "file-name.jpg",
// });

// console.log(response);

export default imagekit;
