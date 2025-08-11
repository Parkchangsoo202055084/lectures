public class Main {
    // 문자들을 사전순으로 정렬 (compareTo 사용)
    static String sortWord(String word) {
        char[] a = word.toCharArray();
        for (int i = 0; i < a.length - 1; i++) {
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (String.valueOf(a[j]).compareTo(String.valueOf(a[j + 1])) > 0) {
                    char t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                }
            }
        }
        return new String(a);
    }

    public static void main(String[] args) {
        String[] words = {"apple", "banana", "cherry"};
        for (String w : words) {
            System.out.println(sortWord(w));
        }
    }
}
