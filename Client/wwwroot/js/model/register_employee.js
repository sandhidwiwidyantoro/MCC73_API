class RegisterEmployee extends Employee{
    constructor(nik, firstName, lastName, phone, birthDate, gender, salary, email, password, degree, gpa, universityId) {
        super(nik, firstName, lastName, phone, birthDate, gender, salary, email);
        this.password = password;
        this.degree = degree;
        this.gPA = gpa;
        this.universityId = universityId;
    }
}