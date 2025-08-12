import java.util.Scanner;

public class Practice3 {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("두 수 입력");
int a = sc.nextInt();
int b = sc.nextInt();
System.out.println("택 일: +, -, *, /");
String op = sc.next().trim();
        switch (op){

    case "+": System.out.println(a+b); break;
    case "-": System.out.println(a-b); break;
    case "*": System.out.println(a*b); break;
    case "/": System.out.println(a/b); break;

}

    }
}
