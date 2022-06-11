const fs = require("fs");
const path = require("path");
const { renameFile } = require("./renameFile");

jest.mock("firebase/storage", () => ({
  ref: jest.fn().mockReturnValue("siheRef"),
  uploadBytes: jest.fn().mockResolvedValue(),
  getStorage: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("firebaseFileURL"),
}));

const next = jest.fn();

describe("Given a renameFile function", () => {
  describe("When it's invoked with no image", () => {
    test("Then the next function shouldn't be called", async () => {
      const expectedCall = 0;

      const req = {
        file: {
          destination: "uploads/images",
          encoding: "7bit",
          fieldname: "images",
          filename: "629f755a7951636442ccf56b",
          mimetype: "image/png",
          originalname: "oister.png",
          path: "uploads/images/629f755a7951636442ccf56b",
          size: 2500,
        },
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((currentpath, newpath, callback) => {
          callback();
        });
      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback();
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await renameFile(req, res, next);

      expect(next).toHaveBeenCalledTimes(expectedCall);
    });
  });

  describe("When receives a new file but file system fails", () => {
    test("Then it should call next function", async () => {
      const req = {
        file: {
          destination: "uploads/images",
          encoding: "7bit",
          fieldname: "images",
          filename: "629f755a7951636442ccf56b",
          mimetype: "image/png",
          originalname: "oister.png",
          path: "uploads/images/629f755a7951636442ccf56b",
          size: 2500,
        },
      };

      jest.spyOn(path, "join").mockReturnValue(path.join("uploads", "images"));

      jest
        .spyOn(fs, "rename")
        .mockImplementation((currentpath, newpath, callback) => {
          callback();
        });

      jest.spyOn(fs, "readFile").mockImplementation((newpath, callback) => {
        callback("readError");
      });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await renameFile(req, res, next);

      expect(next).toHaveBeenCalledWith("readError");
    });
  });
});
