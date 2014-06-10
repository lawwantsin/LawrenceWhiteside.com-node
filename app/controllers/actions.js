var sendLawAnEmail = function(msg) {
  var email     = new sendgrid.Email({
    to:       'law@cinemasetfree.com',
    from:     msg.email,
    subject:  ('New Contact from '+msg.name+' on LawrenceWhiteside.com'),
    text:     msg.message
  });
  sendgrid.send(email, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
}

exports.contact = function(req, res) {
  var msg = new Message(req.body);
  msg.save(function(err, msg) {
    if (err) {
      sendLawAnEmail(msg);
      res.json({error: err});
    }
    else {
      res.json(msg);
    }
  });
}

exports.payment = function(req, res) {
  console.log(req);
//  var msg = new Message(params);
}