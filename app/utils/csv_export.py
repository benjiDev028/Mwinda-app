import csv

def export_to_csv(users, file_name="export_users.csv"):
    file_path = f"/tmp/{file_name}"
    with open(file_path, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["ID", "first_name", "last_name" , "Email", "Rôle", "date_birth", "is_email_verified",  "Points"])
        for user in users:
            writer.writerow([user.id, user.first_name, user.email, user.role, user.points])
    return file_path
