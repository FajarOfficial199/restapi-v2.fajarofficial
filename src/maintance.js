module.exports = {
  maintenance: {
    enabled: false, // Set true untuk mengaktifkan mode maintenance
    title: "Website Under Maintenance",
    message:
      "We're currently upgrading our systems to serve you better. Please check back in a few hours. We apologize for any inconvenience caused.",
    showHomeLink: false, // Tampilkan tombol "Go Home"
    apiResponse: {
      status: false,
      message:
        "Our API services are currently undergoing scheduled maintenance. We expect to be back online shortly. Thank you for your patience.",
    },
  },
};
