from flask import Flask, render_template, request, jsonify, send_file
from flask_mail import Mail, Message
import os

app = Flask(__name__)

# Email Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'nazirshaik.025@gmail.com'
app.config['MAIL_PASSWORD'] = 'slro wrzw iviz yvop'
app.config['MAIL_DEFAULT_SENDER'] = 'nazirshaik.025@gmail.com'

mail = Mail(app)

# Portfolio data - Extracted from Resume
portfolio_data = {
    'name': 'Naziruddin S',
    'headline': 'Enterprise Software Consultant | DevOps Engineer',
    'location': 'Dubai, UAE',
    'mobile': '+971 0503001362',
    'email': 'nazirshaik.025@gmail.com',
    'linkedin': 'https://www.linkedin.com/in/naziruddin-025-s',
    'about': 'Results-driven Enterprise Software Consultant and DevOps Engineer with experience in ERP application support, incident management, system administration, and cloud/DevOps environments. Skilled in providing L1/L2 functional and technical support, troubleshooting complex application issues, managing user access and permissions, and collaborating with cross-functional teams to ensure reliable business operations. Hands-on experience with Jenkins, Docker, Kubernetes, Terraform, AWS, Prometheus, and Grafana, with a strong understanding of CI/CD, cloud infrastructure, monitoring, deployment, and system reliability.',
    'experience': [
        {
            'title': 'Enterprise Software Consultant',
            'company': 'NEXWARE TECHNOLOGIES LLC',
            'location': 'Dubai, UAE',
            'period': 'October 2025 - Present',
            'description': 'Provide Level 1 (L1) functional and technical support for ERP applications, troubleshooting system issues and resolving user queries. Monitor ERP system performance, perform initial diagnostics and root cause analysis. Manage incident tracking, service requests, ticket prioritization, and resolution documentation. Administer user provisioning, role-based access control (RBAC), and permission assignments. Collaborate with cross-functional teams including Finance, Production, Inventory, and Procurement.'
        },
        {
            'title': 'DevOps Engineer',
            'company': 'Wolters Kluwer',
            'location': 'Tamil Nadu, India',
            'period': 'March 2025 - June 2025',
            'description': 'Designed and implemented robust CI/CD pipelines using Jenkins to automate build, test, and deployment processes. Managed infrastructure using Infrastructure as Code (IaC) tools like Terraform and CloudFormation. Monitored system performance using Prometheus and Grafana. Deployed and maintained cloud infrastructure on AWS/Azure including EC2, S3, VPCs, and security groups. Containerized applications using Docker and orchestrated services with Kubernetes for scalable deployments.'
        }
    ],
    'education': [
        {
            'degree': 'Master of Computer Applications (MCA)',
            'institution': 'B. S. Abdur Rahman Crescent Institute Of Science And Technology',
            'location': 'Chennai, TN',
            'period': 'July 2023 - May 2025',
            'cgpa': '9.0'
        },
        {
            'degree': 'Bachelor of Computer Applications (BCA)',
            'institution': 'Guru Nanak College',
            'location': 'Chennai, TN',
            'period': 'July 2020 - May 2023',
            'cgpa': '9.53'
        }
    ],
    'skills': {
        'DevOps & Cloud Tools': ['Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'AWS', 'Azure', 'Prometheus', 'Grafana', 'CloudFormation'],
        'Programming Languages': ['Python', 'HTML5', 'CSS3', 'C', 'C++', 'Java'],
        'Operating Systems': ['Windows', 'Linux'],
        'Productivity Software': ['MS Office', 'Outlook', 'Teams', 'GitHub'],
        'Professional Skills': ['Troubleshooting', 'Stakeholder Management', 'Cross-functional Collaboration', 'End-user Training', 'SOP Development', 'Problem-Solving', 'Time Management', 'CI/CD', 'Infrastructure as Code', 'System Administration']
    },
    'certifications': [
        {
            'name': 'Programming in Java',
            'issuer': 'NPTEL',
            'period': 'July 2024 - October 2024'
        },
        {
            'name': 'Software Testing',
            'issuer': 'NPTEL',
            'period': 'July 2021 - October 2021'
        },
        {
            'name': 'PCAP Programming Essentials In Python',
            'issuer': 'Cisco Networking Academy',
            'period': 'July 2021'
        }
    ],
    'languages': [
        {'name': 'English', 'level': 'Read, Write, Speak'},
        {'name': 'Tamil', 'level': 'Read, Write, Speak'},
        {'name': 'Urdu', 'level': 'Speak'},
        {'name': 'Hindi', 'level': 'Speak'}
    ],
    'projects': [
        {
            'title': 'DripIt — Premium Streetwear E-Commerce Platform',
            'description': 'A fully functional premium streetwear e-commerce web application. Features a bold dark-aesthetic storefront with SS \'25 collection drops, 200+ pieces catalog, category navigation (Hoodies, Oversized Tees, Cargo Pants, Sneakers, Accessories, Limited Drops), 48H dispatch guarantee, and a sleek "Classic Style. Modern Drip." brand identity. Built with HTML, CSS, JavaScript frontend and Python Flask backend — deployed live on Vercel.',
            'tags': ['HTML5', 'CSS3', 'JavaScript', 'Python', 'Flask', 'Vercel', 'E-Commerce', 'Streetwear'],
            'link': 'https://drip-it-gamma.vercel.app/',
            'featured': True,
            'badge': 'Live Project'
        },
        {
            'title': 'Diagnosify — AI-Powered Disease Diagnosis System',
            'description': 'MCA Major Project — Built a comprehensive AI-powered medical diagnostics platform using Streamlit. Features include Alzheimer\'s Detection using custom CNN (4 classes: Non-Demented, Very Mild, Mild, Moderate) with 96%+ accuracy on MRI brain scans, Diabetes Prediction using SVM algorithm, and BMI Calculator with health recommendations. Integrated multiple ML models into a unified, user-friendly web application with real-time analysis and diagnostic insights.',
            'tags': ['Python', 'TensorFlow', 'Keras', 'Scikit-learn', 'Streamlit', 'CNN', 'SVM', 'Medical AI'],
            'link': 'https://disease-diagnosis-system-by-machine-learning-algorithms-app34h.streamlit.app/',
            'featured': False,
            'badge': 'AI Healthcare'
        },
        {
            'title': 'Online Job Portal System',
            'description': 'An online job portal platform where job seekers can sign up, search for jobs that match their skills, and apply for them. Employers can register, post job openings, and find suitable candidates. Built using HTML, CSS, and JavaScript for the front end, PHP for the back end, and XAMPP server for local hosting.',
            'tags': ['HTML', 'CSS', 'JavaScript', 'PHP', 'XAMPP'],
            'link': '#',
            'featured': False,
            'badge': 'Web App'
        },
        {
            'title': 'Steganography Application',
            'description': 'A comprehensive platform for hiding data within various types of multimedia files, including images, audio, and text. The application conceals the existence of hidden data using steganography techniques. Built using Python with Flask Framework.',
            'tags': ['Python', 'Flask', 'Steganography', 'Image Processing'],
            'link': 'https://steganography-fz6z.onrender.com/',
            'featured': False,
            'badge': 'Security'
        }
    ],
    'achievements': [
        {
            'title': 'GOLD MEDALIST - Overall Academics First Rank Holder',
            'institution': 'Guru Nanak College',
            'award': 'Gold Medal'
        },
        {
            'title': 'BCA Academic Proficiency Award Winner',
            'institution': 'Guru Nanak College',
            'award': 'Gold Medal'
        },
        {
            'title': 'BCA Academic Proficiency Award Runner',
            'institution': 'Guru Nanak College',
            'award': 'Silver Medal'
        },
        {
            'title': 'ASSET Award Winner - Academics',
            'institution': 'Sri Sathya Sai Vidyalaya',
            'award': 'Gold Shield'
        },
        {
            'title': 'Class Topper Award Winner - Academics',
            'institution': 'Sri Sathya Sai Vidyalaya',
            'award': 'Gold Shield'
        }
    ]
}

@app.route('/')
def index():
    return render_template('index.html', data=portfolio_data)

@app.route('/download-resume')
def download_resume():
    resume_path = os.path.join(os.path.dirname(__file__), 'static', 'Naziruddin_S_Resume.pdf')
    if os.path.exists(resume_path):
        return send_file(resume_path, as_attachment=True, download_name='Naziruddin_S_Resume.pdf')
    return "Resume not found", 404

def send_email_to_naziruddin(name, email, subject, message):
    """Send email to Naziruddin with the contact form submission"""
    try:
        msg = Message(
            f'New Contact Form Submission from {name}',
            recipients=['nazirshaik.025@gmail.com'],
            reply_to=email
        )
        msg.body = f"""
You have received a new message from your portfolio contact form.

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This message was sent from your portfolio website.
        """
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email to Naziruddin: {e}")
        return False

def send_confirmation_email(name, email, subject, message):
    """Send confirmation email to the user"""
    try:
        msg = Message(
            f'Thank you for contacting Naziruddin S',
            recipients=[email]
        )
        msg.body = f"""
Dear {name},

Thank you for reaching out through my portfolio. I have received your message and will get back to you within 24 hours.

Here's a copy ofmessage you sent:

Subject: {subject}

Message:
{message}

Best regards,
Naziruddin S
Enterprise Software Consultant | DevOps Engineer

---
This is an automated confirmation email. Please do not reply to this message.
        """
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending confirmation email: {e}")
        return False

@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        # Basic validation
        if not data or not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({'success': False, 'error': 'All fields are required'}), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Email validation
        if '@' not in email or '.' not in email:
            return jsonify({'success': False, 'error': 'Invalid email address'}), 400
        
        # Send email to Naziruddin
        naziruddin_email_sent = send_email_to_naziruddin(name, email, subject, message)
        
        # Send confirmation email to user
        confirmation_email_sent = send_confirmation_email(name, email, subject, message)
        
        if naziruddin_email_sent and confirmation_email_sent:
            return jsonify({'success': True, 'message': 'Message sent successfully! Check your email for confirmation.'}), 200
        elif naziruddin_email_sent:
            return jsonify({'success': True, 'message': 'Message sent successfully! (Confirmation email could not be sent)'}), 200
        else:
            return jsonify({'success': False, 'error': 'Failed to send message. Please try again.'}), 500
        
    except Exception as e:
        print(f"Contact form error: {e}")
        return jsonify({'success': False, 'error': 'An error occurred'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
