class DonationController {
    static handleDonation(request, response) {
      const { donator_name, amount_raw, message } = request.body;

    //! Nama donasi dari Saweria.co
      const name = donator_name
    //! Jumlah data donasi
      const amount = parseInt(amount_raw)
    //! No wa didapat dari pesan disaweria maka diwajibkan isi pesan saweria adalah noWA.
      const noWa = message

      if (amount >= 10000) {
        // lakukan sesuatu jika dibayar 10k
        // contoh Update Apikey
        console.log(amount);
      } 
      
      response.status(200);
    }
  }
  
module.exports = DonationController;

//! minimum pembayaran 10k jika dibawah 10k maka tidak dikirim saweria
//! dan jangan lupa untuk menggunakan webhook saweria URL/donate