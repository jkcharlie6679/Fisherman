import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText



def sent_mail(mail, Verify_Code):
    content = MIMEMultipart()  
    content["subject"] = "Fishman Platform Verification"  # title
    content["from"] = "ntust.fisherman@gmail.com"  # sender
    content["to"] = mail # receiver
    content.attach(MIMEText("Your Verify Code is " + Verify_Code))  
    with smtplib.SMTP(host="smtp.gmail.com", port="587") as smtp:  # SMTP server's config
        try:
            smtp.ehlo()  
            smtp.starttls()  
            smtp.login("ntust.fisherman@gmail.com", "key")  # login sender gmail
            smtp.send_message(content)  
            print("Complete!")
        except Exception as e:
            print("Error message: ", e)


