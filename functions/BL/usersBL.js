const db = require('../Routes/API/DB/DAL');
const uuidv4 = require('uuid/v4');
const nodeMailer = require('nodemailer');

const users = db.collection('users');
const tokens = db.collection('tokens');
const session = require('../Helpers/session')
var UserBL = {
    // if user exists - return his data. else return false
    isUserExists: function (email, password = null) {
        return new Promise((resolve, reject) => {           
            var query = users.where('Email', '==', email);           
            if (password){ 
                query =  query.where('Password', '==', password);            
            }               
                
            query.get().then((querySnapshot) => {
               
                var isUserExists = !querySnapshot.empty;
                if(!isUserExists)
                  resolve(isUserExists);
                else
                {
                  querySnapshot.forEach((doc) => {
                    var user = { id : doc.id, data : doc.data() }
                    resolve(user);
                  });
                }           
                return null;
            }).catch((error) => {
                reject(error);
            });

        });
    },

    createUser: function (user) {
        return new Promise((resolve, reject) => {

            const id = uuidv4();
            users.doc(id).set(user).then(res => {
                return this.createToken(id);
            }).catch((error) => {
                reject(error);
            }).then((res => {
                resolve(res);
                return null;
            })).catch((err) => reject(err));
        });
    },

    // logIn: function (user) {
    //     var userData;
    //     return new Promise((resolve, reject) => {
    //        this.isUserExists(user.Email , user.Password).then(response =>{
    //          if(!response)
    //            resolve("notExists");
    //            else{
    //             userData = response;
    //             return this.createToken(response.id); 
    //            }        
    //            return null;   
    //        }).then(data => {
    //            var result = {token : data , userData : userData }
    //            resolve(result);
    //            return null;
    //        }).catch((err) => reject(err));
    //     });
    // },

    logIn: function (user) {
        var userData;
      
           this.isUserExists(user.Email , user.Password).then(response =>{
             if(!response)
               return "notExists";
               else{
                userData = response;
                return this.createToken(response.id); 
               }    
           }).then(data => {
               var result = {token : data , userData : userData }
               return result;
              
           }).catch((err) => reject(err));
      
    },

    forgetPassord : function (email) {
      return new Promise((resolve, reject) => {
      this.isUserExists(email).then(response => {
        if(!response)
        resolve("notExists");
        else{
         var options = {
             from : 'blessing',
             to : response.data.Email,
             subject : 'your password',
             html : `
             <div style='direction:rtl;color:green;'>
               סיסמתך היא: ${response.data.Password}
             </div>
             `
            };
         
         var res = this.sendEmail(options)
         resolve('success');
         
        }
        return null;
      }).catch((err) => reject(err));

      })
    },

    // to do:
    // take care that response will come back from this functuin 
    sendEmail : function (mailOptions) {
        let transporter = nodeMailer.createTransport({
            service: 'gmail',        
            auth: {
                user: 'mmm129m@gmail.com',
                pass: 'navtkhahc'
            },              
        });             
        transporter.sendMail(mailOptions, (error, info) => {           
            if (error) 
                return error;            
            else
                return 'Message-sent';
        });
       
    },

    createToken: function (id) {
        const token = uuidv4();
        session.token = token;
        const expierdDate = new Date(new Date().getTime() + 60 * 60000);
        const tokenData = { userId: id, token: token, expierdDate: expierdDate };
        var response = { success: false, data: tokenData }
        return new Promise((resolve, reject) => {
            tokens.doc().set(tokenData).then(res => {
                response.success = true;
                resolve(response)
                return null;
            }).catch((error) => {
                response.data = error;
                reject(response);
            });
        });
    }
}

module.exports = UserBL;