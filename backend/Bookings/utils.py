from PIL import Image,ImageDraw,ImageFont
from io import BytesIO
import qrcode



def generate_ticket(ticket):
    
    width,height = 600,300
    background_color = "white"
    
    ticket_image = Image.new("RGB",(width,height),background_color)
    draw = ImageDraw.Draw(ticket_image)
    
    try:
        font = ImageFont.truetype("arial.ttf",20)
    except IOError:
        font = ImageFont.load_default()
        
    event_title = f"Event: {ticket.booking.event.title}"
    username = f"Name: {ticket.booking.booked_by.full_name}"
    booking_id = f"Booking ID: {ticket.booking.id}"
    quantity = f"Quanity {ticket.booking.quantity}"
    
    draw.text((20,20),event_title,fill="black",font=font)
    draw.text((20,60),username,fill="black",font=font)
    draw.text((20,100),booking_id,fill="black",font=font)
    draw.text((20,140),quantity,fill="black",font=font)
    
    qr_data = str(ticket.id)
    qr = qrcode.make(qr_data)
    
    qr = qr.resize((100,100))
    ticket_image.paste(qr,(450,50))
    
    image_io = BytesIO()
    ticket_image.save(image_io,format="PNG")
    image_io.seek(0)
    
    return image_io
    