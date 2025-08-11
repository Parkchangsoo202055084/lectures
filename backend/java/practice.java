public class practice {

    public static void main(String[] args) {
        String str1 = "Admin";
        String str2 = "admin";
        if (str1.equalsIgnoreCase(str2))
            System.out.println("로그인 성공");
        else
            System.out.print("아이디가 일치하지 않습니다 \n");

    }
}
