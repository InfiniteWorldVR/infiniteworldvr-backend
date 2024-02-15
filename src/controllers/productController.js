import Product from "../model/productModel";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import { uploadToCloud } from "../helper/cloud";
import stripeApi from "../helper/stripe";

let shipping_collection = [
  "AC",
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CV",
  "CW",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SZ",
  "TA",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VN",
  "VU",
  "WF",
  "WS",
  "XK",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
  "ZZ",
];

const productController = {
  createProduct: tryCatchHandler(async (req, res) => {
    let uploadedImages = [];
    for (let index = 0; index < req.files["images"].length; index++) {
      uploadedImages.push(await uploadToCloud(req.files["images"][index], res));
    }
    let product = await Product.create({
      ...req.body,
      images: uploadedImages.map((item) => item.secure_url),
    });
    return res.json({
      status: "success",
      product,
    });
  }),

  getProducts: tryCatchHandler(async (req, res) => {
    const products = await Product.find();
    return res.json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  }),
  getProductById: tryCatchHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({
      status: "success",
      data: {
        product,
      },
    });
  }),
  updateProduct: tryCatchHandler(async (req, res) => {
    let updatedData;
    console.log(req.files);
    if (req.files["images"]) {
      let uploadedImages = [];
      for (let index = 0; index < req.files["images"].length; index++) {
        uploadedImages.push(
          await uploadToCloud(req.files["images"][index], res)
        );
      }
      updatedData = {
        ...req.body,
        images: uploadedImages.map((item) => item.secure_url),
      };
    } else {
      updatedData = req.body;
    }

    let product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({
      status: "success",
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  }),
  deleteProduct: tryCatchHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json({
      status: "success",
      message: "Product deleted successfully",
    });
  }),
  deleteAll: tryCatchHandler(async (req, res) => {
    await Product.deleteMany();
    return res.json({
      status: "success",
      message: "All products deleted successfully",
    });
  }),
  createCheckoutSession: tryCatchHandler(async (req, res) => {
    const { line_items, customer_email } = req.body;
    if (!line_items || !customer_email) {
      return res.status(400).json({ error: "missing required parameters" });
    }

    const session = await stripeApi.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      customer_email: customer_email,
      mode: "payment",
      success_url: `${process.env.WEB_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEB_APP_URL}/cancelled`,
      shipping_address_collection: {
        allowed_countries: shipping_collection,
      },
    });
    return res.json({ id: session.id });
  }),
  webhook: tryCatchHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripeApi.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("session", session);
    }
    res.status(200).json({
      status: "success",
    });
  }),
  stripeGetAllCheckoutSessions: tryCatchHandler(async (req, res) => {
    const checkoutSessions = await stripeApi.checkout.sessions.list({
      limit: 10,
    });

    console.log(checkoutSessions);
    return res.json({
      status: "success",
      data: {
        checkoutSessions,
      },
    });
  }),

  getBalance: tryCatchHandler(async (req, res) => {
    const balance = await stripeApi.balance.retrieve();
    return res.json({
      status: "success",
      data: {
        balance,
      },
    });
  }),
};

export default productController;
