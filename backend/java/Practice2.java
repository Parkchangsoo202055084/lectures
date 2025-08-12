public class Practice2 {

    static void sum(String message, int ...a){
        int total = 0;
        for(int sum : a) {
            total += sum;
        }
        System.out.println(message+": "+ + total/a.length);
    }

    public static void main(String[] args) {

        sum("평균값", 1,2,3,4,5);
    }

}
