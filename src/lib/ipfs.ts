import axios from "axios";

const pinata = {
  upload: {
    file: async (formData: FormData) => {
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMWZiYzQ4YS0yODljLTRkMjgtOWViZS02ZjkzMWVjMzhiMTgiLCJlbWFpbCI6Imx1Y2lmZXJ4dmlzaGFsMTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjE3MmUwMGEzMGE5ZWI5MzBlOWEyIiwic2NvcGVkS2V5U2VjcmV0IjoiOWQ0Njk5OWQ5OGVkMmYwMDkwMDA5NDRmMThkMTc2NjllNDQ4NDkzZmU4MDM2OGU2NzVmY2FlY2QxNDllZDFkMiIsImV4cCI6MTc1OTM1MTg0OH0.n76jTUin4w69mfYacBHP7hoKJnHApHxBJXnw8asbOnM";

      if (!jwt) {
        throw new Error("Pinata JWT is missing");
      }

      const response = await axios.post(url, formData, {
        maxContentLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      });

      return response.data;
    },
  },
};

export default pinata;
